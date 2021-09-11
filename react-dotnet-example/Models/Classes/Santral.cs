using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace react_dotnet_example.Models.Classes
{
    public class Santral
    {
        [Key]
        public int Id { set; get; }
        public string Name { set; get; }
        public string Eic { set; get; }
        public int OrganizationId { set; get; }
        public Organization Organization { get; set; }

    }
}
