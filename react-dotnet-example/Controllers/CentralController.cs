using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using react_dotnet_example.Models;
using react_dotnet_example.Models.CentralDataRepository;
using react_dotnet_example.Models.Classes;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;


namespace react_dotnet_example.Controllers
{
    [ApiController]
    public class CentralController : ControllerBase
    {
        // =========================================================== General 

        private readonly ILogger<CentralController> _logger;
        private readonly ICentralRepository _centralRepository;

        public CentralController(ILogger<CentralController> logger, ICentralRepository centralRepository)
        {
            _logger = logger;
            _centralRepository = centralRepository;
        }

        // =========================================================== Get Aic and Dpp Data using Organization ETSO and Santral ETSO 

        [HttpPost]
        [Route("api/getDppDataService")]
        [Consumes("application/json")]
        public async Task<string> GetDppDataService(DppParams dppParams)
        {
            HttpClient client = new HttpClient();
            string uri = "https://seffaflik.epias.com.tr/transparency/service/production/dpp?organizationEIC="
                + dppParams.ETSCode + "&uevcbEIC=" + dppParams.EIC 
				+ "&startDate=" + dppParams.stardDate + "&endDate=" + dppParams.endDate;
            string response = await client.GetStringAsync(uri);

            return response;
        }

        [HttpPost]
        [Route("api/getAicDataService")]
        [Consumes("application/json")]
        public async Task<string> GetAicDataService(EicParams aicParams)
        {
            HttpClient client = new HttpClient();
            string uri = "https://seffaflik.epias.com.tr/transparency/service/production/aic?organizationEIC="
                + aicParams.ETSCode + "&uevcbEIC=" + aicParams.EIC + "&startDate=" + aicParams.stardDate + "&endDate=" + aicParams.endDate;
            string response = await client.GetStringAsync(uri);
            /*_logger.LogInformation(response);*/
            return response;
        }

        // =========================================================== Get orgranizations from service 

        [HttpGet]
        [Route("api/getData")]
        [Consumes("application/json")]
        /*Task<IEnumerable<Organisation>>*/
        public async Task<string> GetDataAsync()
        {
            HttpClient client = new HttpClient();
            string response = await client.GetStringAsync("https://seffaflik.epias.com.tr/transparency/service/production/dpp-organization");
            return response;
        }

        // =========================================================== Get Santral from service based don ETSO 

        [HttpPost]
        [Route("api/getInjectionUnitNames")]
        [Consumes("application/json")]
        public async Task<string> GetInjectionUnitNames(ETSCode ETSCode)
        {
            HttpClient client = new HttpClient();
            string uri = "https://seffaflik.epias.com.tr/transparency/service/production/dpp-injection-unit-name?organizationEIC=" + ETSCode.value;
            string response = await client.GetStringAsync(uri);
            /*_logger.LogInformation(response);*/
            return response;
        }

        // =========================================================== Get Central Data from Database that is taken from Service and not from Template 

        [HttpPost]
        [Route("api/getDataDB")]
        [Consumes("application/json")]
        public IActionResult GetDataDB([FromBody] JsonElement parameters)
        {
            IEnumerable<CentralData> data = _centralRepository.GetAllData(parameters);
            var dataList = data.ToList();
            var result = new ArrayList();
            var dataGroups = dataList.GroupBy(dataRow => dataRow.Date.Date);
            foreach (var group in dataGroups)
            {
                var entityNameList = new ArrayList();
                foreach (var row in group)
                {
                    if (!entityNameList.Contains(row.EntityType.Name))
                    {
                        entityNameList.Add(row.EntityType.Name);
                    }
                }
                var groupList = group.ToList(); 

                for (int i = 0; i < groupList.Count; i = i + entityNameList.Count)
                {
                    DateTime tarih = new DateTime();
                    string saat = "";
                    double toplam = 0;
                    int count = 0;
                    Dictionary<string, object> dataOpject = new Dictionary<string, object>();
                    foreach (var entityName in entityNameList)
                    {
                        tarih = group.ElementAt(count + i).Date;
                        saat = group.ElementAt(count + i).Hour;
                        string name = group.ElementAt(count + i).EntityType.Name;
                        dataOpject[name] = group.ElementAt(count + i).Value;
                        count = count + 1;
                    }
                    foreach (var item in dataOpject)
                    {
                        toplam += (double)item.Value;
                    }
                    dataOpject["tarih"] = tarih;
                    dataOpject["saat"] = saat;
                    dataOpject["toplam"] = toplam;
                    result.Add(dataOpject);
                }
            }
            return Ok(result); // If the data is not in the DB this will be an empty array. 
        }

        // =========================================================== Save central Data to the database 
        // Deprecated 

        [HttpPost]
        [Route("api/saveData")]
        [Consumes("application/json")]
        public IActionResult SaveData([FromBody] JsonElement data)
        {
            _centralRepository.AddData(data);
            return Ok();
        }


        // =========================================================== Save Central Data to the database (only the columns that the user has chosen)

        [HttpPost]
        [Route("api/saveSmallData")]
        [Consumes("application/json")]
        public IActionResult SaveSmallData([FromBody] JsonElement data)
        {
            _centralRepository.AddSmallData(data);
            return Ok();
        }

        // =========================================================== This function was used once to load Santral Names and ETSOs to the databsae and it is not used anymore 

        [HttpPost]
        [Route("api/loadSantarlsToDB")]
        [Consumes("application/json")]
        public async Task LoadSantarlsToDB()
        {
            HttpClient client = new HttpClient();
            string OrgaResponse = await client.GetStringAsync("https://seffaflik.epias.com.tr/transparency/service/production/dpp-organization");
            JsonElement Jresponse = JsonDocument.Parse(OrgaResponse).RootElement; // string to JsonElement

            foreach (var orga in Jresponse.GetProperty("body").GetProperty("organizations").EnumerateArray())
            {
                bool isOver = false; 
                while (!isOver)
                {
                    Thread.Sleep(500);

                    string uri = "https://seffaflik.epias.com.tr/transparency/service/production/dpp-injection-unit-name?organizationEIC=" + orga.GetProperty("organizationETSOCode").GetString();
                    var santralResponse = await client.GetAsync(uri);

                    if (santralResponse.IsSuccessStatusCode)
                    {
                        HttpContent content = santralResponse.Content;
                        string jsonContent = await content.ReadAsStringAsync(); 
                        JsonElement JSantralResponse = JsonDocument.Parse(jsonContent).RootElement; // parse json string to JsonElement 
                        _centralRepository.AddOrganisation(orga, JSantralResponse.GetProperty("body").GetProperty("injectionUnitNames"));
                        Console.WriteLine(orga.GetProperty("organizationName").GetString() + " is added");
                        isOver = true;
                    }
                    else
                    {
                        Console.WriteLine("The request failed");
                    }
                }

            }
        }

        // =========================================================== Get all the organization with their Santrals 

        [HttpGet]
        [Route("api/getOrgaSantral")]
        [Consumes("application/json")]
        public IActionResult GetOrgaSantral()
        {
            var result = _centralRepository.GetOrgaSantral();
            var santralList = new ArrayList();
            foreach (var sant in result)
            {
                Organization newOrga = new Organization
                {
                    Id = sant.Organization.Id,
                    OrganizationId = sant.Organization.OrganizationId,
                    OrganizationName = sant.Organization.OrganizationName,
                    OrganizationStatus = sant.Organization.OrganizationStatus,
                    OrganizationETSOCode = sant.Organization.OrganizationETSOCode,
                    OrganizationShortName = sant.Organization.OrganizationShortName
                };

                Santral newSantral = new Santral
                {
                    Id = sant.Id,
                    Name = sant.Name,
                    Eic = sant.Eic, 
                    OrganizationId = sant.OrganizationId,
                    Organization = newOrga
                };

                santralList.Add(newSantral); 

            }
            return Ok(santralList);
        }

        // =========================================================== Save orders to the database 

        [HttpPost]
        [Route("api/saveOrders")]
        [Consumes("application/json")]
        public IActionResult SaveOrders(Order order)
        {
            _centralRepository.AddOrders(order);
            return Ok();
        }

        // =========================================================== Save excel Files to the database  

        [HttpPost]
        [Route("api/uploadFile")]
        public IActionResult UploadFile(IFormCollection data)
        {
            var file = data.Files[0];

            if (data.TryGetValue("fileInfo", out var fileInfo))
            {
                JsonElement JfileInfo = JsonDocument.Parse(fileInfo[0]).RootElement;
                _centralRepository.AddExcelFile(JfileInfo, file); 
            }

            return Ok();
        }

        // =========================================================== Get all orders from the databse regardless of whether the orders are active or not 

        [HttpGet]
        [Route("api/getOrders")]
        [Consumes("application/json")]
        public IActionResult GetOrders()
        {
            var orders = _centralRepository.GetOrders(); 
            return Ok(orders);
        }

        // =========================================================== Get Excel Files 

        [HttpPost]
        [Route("api/getExcelFiles")]
        [Consumes("application/json")]
        public IActionResult GetExcelFiles(JsonElement data)
        {
            var excelFiles = _centralRepository.GetExcelFiles(data);
            return Ok(excelFiles);
        }
    }
}
