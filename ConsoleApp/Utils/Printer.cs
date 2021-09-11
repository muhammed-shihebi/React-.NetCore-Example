using ConsoleApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp.Utils
{
    class Printer
    {
        public static void PrintOrders(List<Order> orders)
        {
            if(orders.Count == 0)
            {
                Console.WriteLine("There is no orders to print! ");
            }
            foreach (Order order in orders)
            {
                Console.WriteLine("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}",
                    order.Id,
                    order.SantralETSO,
                    order.OrgaETSO,
                    order.Time,
                    (order.State == Order.ACTIVE ? "Active" : "Passive"),
                    (order.DataSource == Order.DATABASE ? "Database": (order.DataSource == Order.SERVICE? "Service": "Template")),
                    (order.DataType == Order.DPP ? "Dpp" : "Aic"), 
                    order.ExecutionTimes);
            }
        }
        public static void PrintExcelList(List<List<Excel>> excelListList)
        {
            if (excelListList.Count == 0)
            {
                Console.WriteLine("There is no records to print! ");
            }

            foreach (var excelList in excelListList)
            {
                if(excelList.Count > 0)
                {
                    Console.WriteLine("\nDataType: {0}, Data Source: {1}, ETSO: {2}, Order Id: {3}\n",
                    excelList[0].DataType,
                    excelList[0].DataSource,
                    excelList[0].SantralETSO,
                    excelList[0].OrderId
                    );
                }

                foreach (var excel in excelList)
                {
                    Console.WriteLine("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}\t{11}\t{12}\t{13}",
                        excel.Tarih,
                        excel.Toplam,
                        excel.Dogalgaz,
                        excel.Ruzgar,
                        excel.Linyit,
                        excel.TasKomur,
                        excel.IthalKomur,
                        excel.FuelOil,
                        excel.Jeotermal,
                        excel.Barajli,
                        excel.Nafta,
                        excel.Biokutle,
                        excel.Akarsu,
                        excel.Diger);
                }
            }
        }
    }
}
