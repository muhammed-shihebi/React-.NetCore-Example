using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace react_dotnet_example.Models.Classes
{
    public class Organization
    {
        [Key]
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public string OrganizationStatus { get; set; }
        public string OrganizationETSOCode { get; set; }
        public string OrganizationShortName { get; set; }
        public ICollection<Santral> Santrals { get; set; } // to make one to maney relationship 
    }
}

