using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp
{
    class Order
    {

        public static int DATABASE = 0;
        public static int SERVICE = 1;
        public static int TEMPLATE = 2;
        public static int ACTIVE = 1;
        public static int PASSIVE = 0;
        public static int DPP = 0;
        public static int AIC = 1;

        [Key]
        public int Id { set; get; }
        public string SantralETSO { set; get; }
        public string OrgaETSO { set; get; }
        public DateTime Time { set; get; } // hour
        public int State { set; get; } // Active/Passive 
        public int DataSource { set; get; } // Database/Service
        public int ExecutionTimes { set; get; }
        public int DataType { set; get; } // Dpp/Aic 
    }
}