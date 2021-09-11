using ConsoleApp.Data;
using ConsoleApp.Utils;
using System;
using System.Threading.Tasks;

namespace ConsoleApp
{
    class Program
    {
        static async Task Main(string[] args)
        {

            var database = new Database(); 
            Repository repo = new Repository(database);

            // process excel files 
            var excelFileReader = new ExcelHandler(database);
            excelFileReader.ReadExcelFiles(); 
            

            // Get all orders 
            var orders = repo.GetOrders();
            Printer.PrintOrders(orders);

            // Get data that associated with each order 
            var excelListList = await repo.GetExcelData(orders);
            Printer.PrintExcelList(excelListList);

            // Save data to excel files 
            var doneOrders = ExcelHandler.CreateExcelFile(excelListList, orders);

            // Mark done orders as done
            if (doneOrders.Count != 0)
            {
                repo.MarkDone(doneOrders); 
            }
        }
    }
}