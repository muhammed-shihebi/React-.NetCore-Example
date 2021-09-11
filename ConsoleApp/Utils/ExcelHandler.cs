using ConsoleApp.Models;
using System;
using System.Collections.Generic;
using System.IO;
using OfficeOpenXml;
using ConsoleApp.Data;
using OfficeOpenXml.Style;

namespace ConsoleApp.Utils
{
    class ExcelHandler
    {

        private Database database;
        private List<EntityType> entityTypes = new List<EntityType>(); 
        public ExcelHandler(Database database)
        {
            this.database = database;
        }

        // =========================================================== Read data from the Templates and save it to the database 

        public void ReadExcelFiles()
        {
            var excelFiles = database.GetAllFiles();

            foreach (var excelFile in excelFiles)
            {
                try
                {
                    using (MemoryStream memStream = new MemoryStream(excelFile.File))
                    {
                        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                        ExcelPackage package = new ExcelPackage(memStream);

                        if(package.Workbook.Worksheets.Count > 1)
                        {
                            var message = $"Excel File contains more than one Sheet";
                            EditExcelFileInDB(excelFile, message, ExcelFile.ERROR, ExcelFile.NOTDONE); 
                            return;
                        }

                        foreach (ExcelWorksheet worksheet in package.Workbook.Worksheets)
                        {
                            if(worksheet.Name != excelFile.SantralETSO)
                            {
                                var message = $"The name of the sheet: {worksheet.Name} != expected name {excelFile.SantralETSO}";
                                EditExcelFileInDB(excelFile, message, ExcelFile.ERROR, ExcelFile.NOTDONE);
                                return;
                            }


                            if (worksheet.Dimension.End.Row != 25)
                            {
                                var message = $"Satır sayısı '{worksheet.Dimension.End.Row}' beklendiği gibi '25' değil";
                                EditExcelFileInDB(excelFile, message, ExcelFile.ERROR, ExcelFile.NOTDONE);
                                return; 
                            }
                            else if (worksheet.Dimension.End.Column != 14)
                            {
                                var message = $"Sütün sayısı '{worksheet.Dimension.End.Column}' beklendiği gibi '14' değil";
                                EditExcelFileInDB(excelFile, message, ExcelFile.ERROR, ExcelFile.NOTDONE);
                                return;
                            }
                            else
                            {
                                // for each row 
                                for (int i = worksheet.Dimension.Start.Row + 1 ; i <= worksheet.Dimension.End.Row; i++)
                                {

                                    // get tarih of each row 
                                    DateTime tarih = DateTime.Now; 
                                    for (int k = 1; k < worksheet.Dimension.End.Column; k++)
                                    {
                                        if((worksheet.Cells[1, k].Value).ToString().ToLower() == "tarih")
                                        {
                                            tarih = DateTime.FromOADate((double)worksheet.Cells[i, k].Value);
                                            break; 
                                        }
                                    }

                                    // for each column
                                    for (int j = worksheet.Dimension.Start.Column; j <= worksheet.Dimension.End.Column; j++)
                                    {
                                        var columnName = (worksheet.Cells[1, j].Value).ToString(); // just get the name of the column

                                        if(columnName.ToLower() == "tarih" || columnName.ToLower() == "toplam")
                                        {
                                            continue; 
                                        }

                                        var entityId = GetEntityId(columnName);

                                        if(entityId == -1)
                                        {
                                            var message = $"Column name '{columnName}' is not valid name for a column";
                                            EditExcelFileInDB(excelFile, message, ExcelFile.ERROR, ExcelFile.NOTDONE);
                                            return;
                                        }

                                        double excelValue;
                                        double.TryParse((worksheet.Cells[i, j].Value).ToString().Replace(',', '.'), out excelValue);

                                        CentralData cd = new CentralData()
                                        {
                                            CompanyETSCode = excelFile.OrgaETSO,
                                            PlantEIC = excelFile.SantralETSO,
                                            DataType = excelFile.DataType,
                                            Date = tarih,
                                            Hour = tarih.TimeOfDay.Hours.ToString(),
                                            EntityTypeId = entityId,
                                            Value = excelValue,
                                            DataSource = CentralData.TEMPLATEDATASOURCE
                                        };
                                        database.AddToCentral(cd); 
                                    }

                                }
                            }
                        }
                    }
                }
                catch (Exception err)
                {
                    var message = err.Message;
                    EditExcelFileInDB(excelFile, message, ExcelFile.ERROR, ExcelFile.NOTDONE);
                    return;
                }
                var successMessage = "Dosya hatasız işlendi";
                EditExcelFileInDB(excelFile, successMessage, ExcelFile.NOERROR, ExcelFile.DONE);
            }
        }


        // =========================================================== Save Excel Files 

        public static List<Order> CreateExcelFile(List<List<Excel>> excelListList, List<Order> orders)
        {
            var successfulOrderList = new List<Order>();

            if (excelListList.Count != 0)
            {
                var date = DateTime.Now;
                string folderPath = @"c:\Users\Nour\Desktop\Orders\" + date.Date.ToString("yyyy-MM-dd");

                if (Directory.Exists(folderPath))
                {
                    Console.WriteLine("Folder exists already.");
                }
                else
                {
                    Directory.CreateDirectory(folderPath);
                    Console.WriteLine("New folder created.");
                }

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                foreach (var excelList in excelListList)
                {
                    if (excelList.Count > 0)
                    {
                        // excel file 
                        ExcelPackage excelPackage = new ExcelPackage();
                        var workSheet = excelPackage.Workbook.Worksheets.Add(excelList[0].SantralETSO);

                        // styles 
                        workSheet.TabColor = System.Drawing.Color.Black;
                        /*workSheet.DefaultRowHeight = 12;*/

                        // style of the the title row 
                        workSheet.Row(1).Height = 20;
                        workSheet.Row(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        workSheet.Row(1).Style.Font.Bold = true;

                        // fill the first row with names 
                        // count starts with 1
                        for (int i = 1; i <= 14; i++)
                        {
                            var prop = excelList[0].GetType().GetProperties()[i - 1];
                            workSheet.Cells[1, i].Value = prop.Name;
                        }

                        // fill up the data in the sheet
                        for (int i = 0; i < excelList.Count; i++) // rows 
                        {
                            for (int j = 0; j < 14; j++) // columns 
                            {
                                var prop = excelList[i].GetType().GetProperties()[j];

                                if(prop.Name.ToLower() == "tarih")
                                {
                                    workSheet.Cells[i + 2, j + 1].Style.Numberformat.Format = "dd/MM/yyyy HH:mm:ss AM/PM";
                                }
                                workSheet.Cells[i + 2, j + 1].Value = prop.GetValue(excelList[i], null);
                                workSheet.Column(j + 1).AutoFit();
                            }
                        }

                        string fileName = $"{excelList[0].Tarih.Date.ToString("yyyy-MM-dd")}_{excelList[0].OrgaETSO}_{excelList[0].SantralETSO}_{excelList[0].DataType}_{excelList[0].DataSource}_{excelList[0].OrderId}.xlsx";
                        string filePath = folderPath + @"\" + fileName;

                        // delete old file if exists 
                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }

                        // create empty file 
                        FileStream objFileStrm = File.Create(filePath);
                        objFileStrm.Close();

                        // write to the file 
                        File.WriteAllBytes(filePath, excelPackage.GetAsByteArray());

                        // close the file 
                        excelPackage.Dispose();

                        var theOrder = orders.Find(order => order.Id == excelList[0].OrderId);
                        if (theOrder is Order)
                        {
                            successfulOrderList.Add(theOrder);
                        }

                    }
                }
            }
            return successfulOrderList;
        }


        // =========================================================== Utils 

        // =========================================================== Using Entity name get EnityId to use it while uploading central data to the database 

        public int GetEntityId(string entityName)
        {
            if(entityTypes.Count == 0)
            {
                entityTypes = database.GetEntityTypes();
            }
            var entityType = entityTypes.Find(entityType => entityType.Name.ToLower() == entityName.ToLower());
            if(entityType is EntityType)
            {
                return entityType.Id;
            }
            else { return -1; }
        }

        // =========================================================== Function to edit the Excel file with the result string 

        private void EditExcelFileInDB(ExcelFile excelFile, string message, int errorInt, int state)
        {
            Console.WriteLine(message);
            excelFile.Message = message;
            excelFile.Error = errorInt;
            excelFile.State = state;
            database.UdateExcelFileInfo(excelFile);
        }

    }

}
