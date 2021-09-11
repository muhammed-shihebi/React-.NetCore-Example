using ConsoleApp.DataContext;
using ConsoleApp.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;


namespace ConsoleApp.Data
{
    class Database
    {

        // =========================================================== Get Valid orders from the database 
        public List<Order> GetOrders()
        {
            using (var context = new AppDbContext())
            {
                var orders = context.Orders
                    .AsEnumerable() // Use this to avoid "The LINQ expression could not be translated". This will get all the data and then make client evaluation
                    .Where(order=> 
                    (order.State == 1)
                    && ((DateTime.Now.Date - order.Time.Date).TotalDays > order.ExecutionTimes)
                    && DateTime.Compare(DateTime.Now, order.Time) > 0 ) // meaning the time of the oder has passed because now is bigger than the order's time 
                    .OrderBy(order => order.Time)
                    .ToList();
                return orders;
            }
        }

        // =========================================================== Get All Central Data: Database/Template 

        public List<CentralData> GetCentralData(Order order)
        {
            
            using (var context = new AppDbContext())
            {
                var cantralList = context.CentralDatas
                   .Include(cd => cd.EntityType)
                   .AsEnumerable()
                   .Where(cd=>
                   (DateTime.Now.Date - cd.Date.Date).TotalDays == 0 // = 0 means the date of the data should be equal to today's date. 
                   && cd.DataType == order.DataType
                   && cd.PlantEIC == order.SantralETSO
                   && cd.DataSource == (order.DataSource == Order.DATABASE? CentralData.SERVICEDATASOURCE: CentralData.TEMPLATEDATASOURCE))
                   .OrderBy(cd => cd.Date)
                   .ToList();
                return cantralList;
            }
        }

        // =========================================================== Update info of excel File 

        internal void UdateExcelFileInfo(ExcelFile excelFile)
        {
            using (var context = new AppDbContext())
            {
                var oldExcelFile = context.ExcelFiles
                    .Where(ef => ef.Id == excelFile.Id).FirstOrDefault(); 
                if(excelFile is ExcelFile)
                {
                    oldExcelFile.State = excelFile.State;
                    oldExcelFile.Message = excelFile.Message;
                    oldExcelFile.Error = excelFile.Error;
                    context.SaveChanges(); 
                }
            }
        }

        // =========================================================== Mark orders as done 

        public void MarkDone(List<Order> orders)
        {
            using (var context = new AppDbContext())
            {
                foreach (var order in orders)
                {
                    var oResult = context.Orders.Where(o => o.Id == order.Id).FirstOrDefault(); 
                    if(oResult != null)
                    {
                        oResult.ExecutionTimes += 1; 
                    }
                }
                context.SaveChanges();
            }
        }

        // =========================================================== get all excel files that are not processed yet 

        public List<ExcelFile> GetAllFiles()
        {
            using (var context = new AppDbContext())
            {
                var excelFiles = context.ExcelFiles
                    .AsEnumerable()
                    .Where(ef =>
                    ef.State == ExcelFile.NOTDONE
                    && ef.Error != ExcelFile.ERROR
                    )
                    .OrderBy(ef => ef.Date)
                    .ToList();
                return excelFiles; 
            }
        }

        // =========================================================== Get all the datatypes as a list to use them to get the entity names 

        public List<EntityType> GetEntityTypes()
        {
            using (var context = new AppDbContext())
            {
                var entityTypes = context.EntityTypes.ToList();
                return entityTypes; 
            }
        }

        // =========================================================== Add Template data to the database 

        public void AddToCentral(CentralData newCd)
        {
            using (var context = new AppDbContext())
            {
                var query = context.CentralDatas
                    .Where(cd =>
                    cd.CompanyETSCode == newCd.CompanyETSCode
                    && cd.PlantEIC == newCd.PlantEIC
                    && cd.DataType == newCd.DataType
                    && cd.Date == newCd.Date
                    && cd.EntityTypeId == newCd.EntityTypeId
                    && cd.DataSource == CentralData.TEMPLATEDATASOURCE
                    ).ToList();

                foreach (var oldCd in query)
                {
                    context.CentralDatas.Remove(oldCd);
                    context.SaveChanges(); 
                }

                context.CentralDatas.Add(newCd); 
                context.SaveChanges();
            }
        }
    }
}
