using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp.Models
{
    class CentralData
    {
        public const int SERVICEDATASOURCE = 0;
        public const int TEMPLATEDATASOURCE = 1;

        [Key]
        public int Id { set; get; }
        public string CompanyETSCode { set; get; }
        public string PlantEIC { set; get; }
        public int DataType { set; get; }
        public DateTime Date { set; get; }
        public string Hour { set; get; }
        public int EntityTypeId { set; get; }
        public double Value { set; get; }
        public int DataSource { set; get; }
        public EntityType EntityType { get; set; }
    }
}
