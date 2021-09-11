using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp.Models
{
    class ExcelFile
    {
        public static int DONE = 1;
        public static int NOTDONE = 0;
        public static int ERROR = 1;
        public static int NOERROR = 0;
        public static string NOT_PROCESSED_MESSAGE = "Dosya henüz işlenmedi";
        public static string PROCESSED_MESSAGE = "Dosya henüz işlenmedi";

        [Key]
        public int Id { set; get; }
        public byte[] File { set; get; }
        public string FileName { set; get; }
        public string SantralETSO { set; get; }
        public string OrgaETSO { set; get; }
        public int DataType { set; get; }
        public int State { set; get; } = NOTDONE;
        public int Error { set; get; } = NOERROR;
        public string Message { set; get; } = NOT_PROCESSED_MESSAGE;
        public DateTime Date { set; get; }
    }
}