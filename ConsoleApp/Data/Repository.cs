using ConsoleApp.Data;
using ConsoleApp.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace ConsoleApp
{
    class Repository
    {

        private Database database;

        public Repository(Database database)
        {
            this.database = database;
        }

        public List<Order> GetOrders()
        {
            return database.GetOrders();
        }

        public async Task<List<List<Excel>>> GetExcelData(List<Order> orders)
        {
            string date = DateTime.Now.ToString("yyyy-MM-dd"); // the date should be always now 
            HttpClient client = new HttpClient();
            var excelListList = new List<List<Excel>>();

            foreach (Order order in orders)
            {
                string datatype = order.DataType == Order.DPP ? "dpp" : "aic";

                if (order.DataSource == Order.SERVICE)
                {
                    string uri = "https://seffaflik.epias.com.tr/transparency/service/production/" + datatype + "?organizationEIC=" + order.OrgaETSO + "&uevcbEIC=" + order.SantralETSO + "&startDate=" + date + "&endDate=" + date;
                    string response = await client.GetStringAsync(uri);
                    JsonElement Jresponse = JsonDocument.Parse(response).RootElement;
                    var excelList = convertToExcel(Jresponse, order);
                    excelListList.Add(excelList);
                }
                else // Template or Database in the GetCantralData and based on the order.DataSource 
                {
                    var centralList = database.GetCentralData(order);
                    if(centralList.Count == 0)
                    {
                        Console.WriteLine($"There is no data in the Database associated with the order {order.Id}");
                    }
                    else
                    {
                        var excelList = convertToExcel(centralList, order);
                        excelListList.Add(excelList);
                    }
                    
                }
            }
            return excelListList;
        }


        public void MarkDone(List<Order> orders)
        {
            database.MarkDone(orders);
        }

        // =========================================================== Utils 

        // convert service/database result to CantralDataExcel
        private List<Excel> convertToExcel(object data, Order order)
        {
            if (order.DataSource == Order.SERVICE)
            {
                var jData = (JsonElement)data;
                var excelList = new List<Excel>();
                string datatype = order.DataType == Order.DPP ? "dpp" : "aic";

                foreach (var row in jData.GetProperty("body").GetProperty(datatype + "List").EnumerateArray())
                {
                    Excel excelRow = new Excel
                    {
                        Tarih = DateTime.Parse(row.GetProperty("tarih").GetString()),
                        Dogalgaz = row.GetProperty("dogalgaz").GetDouble(),
                        Ruzgar = row.GetProperty("ruzgar").GetDouble(),
                        Linyit = row.GetProperty("linyit").GetDouble(),
                        TasKomur = row.GetProperty("tasKomur").GetDouble(),
                        IthalKomur = row.GetProperty("ithalKomur").GetDouble(),
                        FuelOil = row.GetProperty("fuelOil").GetDouble(),
                        Jeotermal = row.GetProperty("jeotermal").GetDouble(),
                        Barajli = row.GetProperty("barajli").GetDouble(),
                        Nafta = row.GetProperty("nafta").GetDouble(),
                        Biokutle = row.GetProperty("biokutle").GetDouble(),
                        Akarsu = row.GetProperty("akarsu").GetDouble(),
                        Diger = row.GetProperty("diger").GetDouble(),
                        SantralETSO = order.SantralETSO,
                        OrgaETSO = order.OrgaETSO,
                        DataType = (order.DataType == Order.DPP ? "dpp" : "aic"),
                        OrderId = order.Id,
                        DataSource = "service"
                    };
                    excelList.Add(excelRow);
                }
                return excelList;
            }
            else
            {
                var dbData = (List<CentralData>) data;
                var excelList = new List<Excel>();
                var entityNameList = new ArrayList();

                foreach (var row in dbData)
                {
                    if (!entityNameList.Contains(row.EntityType.Name))
                    {
                        entityNameList.Add(row.EntityType.Name);
                    }
                }

                for (int i = 0; i < dbData.Count; i += entityNameList.Count) // considering each hour by itself
                {
                    Excel excelRow = new Excel()
                    {
                        Tarih = dbData.ElementAt(i).Date,
                        SantralETSO = order.SantralETSO,
                        OrgaETSO = order.OrgaETSO,
                        DataType = (order.DataType == Order.DPP ? "dpp" : "aic"),
                        OrderId = order.Id,
                        DataSource = (order.DataSource == Order.DATABASE ? "database" : "template")
                    };

                    for (int index = 0; index < entityNameList.Count; index++) 
                    {
                        string entityName = dbData.ElementAt(i + index).EntityType.Name; 
                        excelRow.GetType().GetProperty(char.ToUpper(entityName[0]) + entityName.Substring(1)).SetValue(excelRow, dbData.ElementAt(index + i).Value); 
                    }
                    excelList.Add(excelRow);
                }
                return excelList;
            }
        }
    }
}
