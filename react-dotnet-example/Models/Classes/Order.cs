using System;
using System.ComponentModel.DataAnnotations;

namespace react_dotnet_example.Models.Classes
{
    public class Order
    {
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