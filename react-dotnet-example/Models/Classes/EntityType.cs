using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace react_dotnet_example.Models.Classes
{
    public class EntityType
    {
        [Key]
        public int Id { get; set; } 
        [Required]
        public string Name { get; set; }
        public ICollection<CentralData> CentralDatas { get; set; } // to make one to maney relationship 
    }
}
