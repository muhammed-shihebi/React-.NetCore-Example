using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using react_dotnet_example.Models.Classes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace react_dotnet_example.Models.CentralDataRepository
{
    public class SQLCentralRepository : ICentralRepository
    {

        public const int DOGALGAZ = 1;
        public const int RUZGAR = 2;
        public const int LINYIT = 3;
        public const int TASKOMUR = 4;
        public const int ITHALKOMUR = 5;
        public const int FUELOIL = 6;
        public const int JEOTERMAL = 7;
        public const int BARAJLI = 8;
        public const int NAFTA = 9;
        public const int BIOKUTLE = 10;
        public const int AKARSU = 11;
        public const int DIGER = 12;

        private AppDbContext context;

        public SQLCentralRepository(AppDbContext context)
        {
            this.context = context;
        }

        // =========================================================== Add Central Data to the database (assuming the user added all the columns)
        // Deprecated 

        public void AddData([FromBody] JsonElement data)
        {
            string eic = data.GetProperty("EIC").GetString();
            string etsCode = data.GetProperty("ETSCode").GetString();
            int dataType = data.GetProperty("DataType").GetInt32();
            DateTime aDateTime = DateTime.Parse(data.GetProperty("Data").EnumerateArray().ElementAt(0).GetProperty("tarih").GetString());

            CentralData aCd = new CentralData()
            {
                CompanyETSCode = etsCode,
                PlantEIC = eic,
                DataType = dataType,
                Date = aDateTime
            };

            RemoveData(aCd);

            foreach (var datum in data.GetProperty("Data").EnumerateArray())
            {
                for (int i = 1; i <= 12; i++)
                {
                    CentralData cd = new CentralData()
                    {
                        CompanyETSCode = etsCode,
                        PlantEIC = eic,
                        DataType = dataType,
                        Date = DateTime.Parse(datum.GetProperty("tarih").GetString()),
                        Hour = (DateTime.Parse(datum.GetProperty("tarih").GetString()).Hour).ToString(),
                        EntityTypeId = i,
                        Value = datum.GetProperty(getEntityName(i)).GetDouble()
                    };
                    context.CentralDatas.Add(cd);
                }
            }
            context.SaveChanges();
        }

        // =========================================================== Get All central data that it's datasource is service and not template in a specific date 

        public IEnumerable<CentralData> GetAllData([FromBody] JsonElement parameters)
        {
            string eic = parameters.GetProperty("EIC").GetString();
            string etsCode = parameters.GetProperty("ETSCode").GetString();
            DateTime startDate = parameters.GetProperty("stardDate").GetDateTime();
            DateTime endDate = parameters.GetProperty("endDate").GetDateTime();
            int dataType = parameters.GetProperty("dataType").GetInt32();

            var query = context.CentralDatas
                .Include(cd => cd.EntityType)
                .Where(cd =>
                (cd.Date.Date >= startDate.Date)
                && (cd.Date.Date <= endDate.Date)
                && (cd.DataType == dataType)
                && (cd.CompanyETSCode == etsCode)
                && (cd.PlantEIC == eic)
                && (cd.DataSource == CentralData.SERVICEDATASOURCE))
                .OrderBy(cd => cd.Date);
            return query;
        }

        // =========================================================== Remove All Cantral Data of one Day 
        public void RemoveData(CentralData dataToGet)
        {
            var query = context.CentralDatas
                .Where(cd =>
                (cd.CompanyETSCode == dataToGet.CompanyETSCode) &&
                (cd.PlantEIC == dataToGet.PlantEIC) &&
                (cd.DataType == dataToGet.DataType) &&
                (cd.Date.Date == dataToGet.Date.Date));

            foreach (var item in query)
            {
                context.CentralDatas.Remove(item);
            }
            context.SaveChanges();
        }


        // =========================================================== Save portion of the aic or dpp data to the database  

        public void AddSmallData(JsonElement data)
        {
            string eic = data.GetProperty("EIC").GetString();
            string etsCode = data.GetProperty("ETSCode").GetString();
            int dataType = data.GetProperty("DataType").GetInt32();


            string[] eFields = { "tarih", "saat", "toplam" };

            // loop through all the data points in the data 
            foreach (var datum in data.GetProperty("Data").EnumerateArray())
            {
                DateTime aDateTime = DateTime.Parse(datum.GetProperty("tarih").GetString());
                // loop through the properties of a data point 
                foreach (var property in datum.EnumerateObject()) // property = dogalgaz, ruzgar, ...
                {
                    if (!eFields.Contains(property.Name))
                    {
                        // get the id of this property 
                        var propertyId = context.EntityTypes
                            .Where(et => et.Name == property.Name)
                            .FirstOrDefault();

                        // delete any data point in the database with the same data 
                        var itemToDelete = context.CentralDatas
                            .Where(cd =>
                            (cd.CompanyETSCode == etsCode) &&
                            (cd.PlantEIC == eic) &&
                            (cd.DataType == dataType) &&
                            (cd.Date == aDateTime) &&
                            (cd.EntityTypeId == propertyId.Id) && 
                            (cd.DataSource == CentralData.SERVICEDATASOURCE))
                            .FirstOrDefault();


                        if (itemToDelete != null)
                        {
                            context.CentralDatas.Remove(itemToDelete);
                            context.SaveChanges();
                        }


                        // Add the new data point to the database. 
                        CentralData cd = new CentralData()
                        {
                            CompanyETSCode = etsCode,
                            PlantEIC = eic,
                            DataType = dataType,
                            Date = DateTime.Parse(datum.GetProperty("tarih").GetString()),
                            Hour = (DateTime.Parse(datum.GetProperty("tarih").GetString()).Hour).ToString(),
                            EntityTypeId = propertyId.Id,
                            Value = datum.GetProperty(getEntityName(propertyId.Id)).GetDouble(), 
                            DataSource = CentralData.SERVICEDATASOURCE
                        };
                        context.CentralDatas.Add(cd);
                    }
                }
            }
            context.SaveChanges();
        }

        // =========================================================== Add All Organiztions to the databse with their santrals 

        public void AddOrganisation(JsonElement orga, JsonElement santrals)
        {

            Organization newOrga = new Organization()
            {
                OrganizationId = orga.GetProperty("organizationId").GetInt32(),
                OrganizationName = orga.GetProperty("organizationName").GetString(),
                OrganizationStatus = orga.GetProperty("organizationStatus").GetString(),
                OrganizationETSOCode = orga.GetProperty("organizationETSOCode").GetString(),
                OrganizationShortName = orga.GetProperty("organizationShortName").GetString()

            };

            context.Organizations.Add(newOrga);
            context.SaveChanges();

            var query3 = context.Organizations.Where(orga => orga.OrganizationId == newOrga.OrganizationId).FirstOrDefault();



            foreach (var santral in santrals.EnumerateArray())
            {
                Santral newSantral = new Santral()
                {
                    Name = santral.GetProperty("name").GetString(),
                    Eic = santral.GetProperty("eic").GetString(),
                    OrganizationId = query3.Id
                };

                context.Santrals.Add(newSantral);
                context.SaveChanges();
            }
        }

        // =========================================================== Get all organization with their santrals 

        public IEnumerable<Santral> GetOrgaSantral()
        {
            var query = context.Santrals
                .Include(sant => sant.Organization)
                .OrderBy(sant => sant.Name);
            return query;
        }

        // =========================================================== Add orders to the database 

        public void AddOrders(Order data)
        {
            // to local time to be saved as the local time and UTC 
            data.Time = data.Time.ToLocalTime();

            // update orders if they exist before in the table 

            var oldOrder = context.Orders
                .Where(order =>
                order.SantralETSO == data.SantralETSO
                && order.DataType == data.DataType
                ).FirstOrDefault();

            if (oldOrder is Order)
            {
                oldOrder.Time = data.Time;
                oldOrder.State = data.State;
                oldOrder.DataSource = data.DataSource;
            }
            else
            {
                context.Orders.Add(data);
            }
            context.SaveChanges();
        }


        // =========================================================== Add excel file to the database  

        public void AddExcelFile(JsonElement jfileInfo, IFormFile file)
        {

            if (file.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    file.CopyTo(ms);
                    var fileBytes = ms.ToArray();

                    var _File = fileBytes;
                    var _FileName = jfileInfo.GetProperty("FileName").GetString();
                    var _SantralETSO = jfileInfo.GetProperty("SantralETSO").GetString();
                    var _OrgaETSO = jfileInfo.GetProperty("OrgaETSO").GetString();
                    var _DataType = jfileInfo.GetProperty("DataType").GetInt32();
                    var _Date = (jfileInfo.GetProperty("Date").GetDateTime()).ToLocalTime();


                    ExcelFile ef = new ExcelFile
                    {
                        File = fileBytes,
                        FileName = _FileName,
                        SantralETSO = _SantralETSO,
                        OrgaETSO = _OrgaETSO,
                        DataType = _DataType,
                        Date = _Date
                    };
                    context.Add(ef);
                    context.SaveChanges();
                }
            }
        }


        // =========================================================== Get all orders Orders 

        public List<Order> GetOrders()
        {
            var orders = context.Orders.ToList();
            return orders;
        }

        // =========================================================== Get ExcelFiles 

        public List<ExcelFile> GetExcelFiles(JsonElement data)
        {

            var santralETSO = data.GetProperty("SantralETSO").GetString();

            var excelFile = context.ExcelFiles
                .Where(ef =>
                ef.SantralETSO == santralETSO
                ).ToList(); 

            return excelFile;
        }

        // =========================================================== Get entity name based on entity id  

        public string getEntityName(int entityId)
        {
            var entityTypes = context.EntityTypes.ToList(); // get all entitytypes 
            var entityType = entityTypes.Find(entityType => entityType.Id == entityId);
            return entityType.Name;
        }
    }
}
