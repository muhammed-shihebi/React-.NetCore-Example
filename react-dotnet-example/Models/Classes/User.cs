using System.ComponentModel.DataAnnotations;

namespace react_dotnet_example.Models
{
    public class User
    {
        [Required]
        public string password { get; set; }
        [Required]
        [Key]
        public string email { get; set; }
    }
}