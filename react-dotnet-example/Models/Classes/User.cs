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
/*
        public override bool Equals(object obj) => this.Equals(obj as User);
        private bool Equals(User otherUser)
        {
            if (otherUser is null)
            {
                return false;
            }
            if (this.GetType() != otherUser.GetType())
            {
                return false;
            }
            return (password == otherUser.password) && (email == otherUser.email);
        }

        public override int GetHashCode()
        {
            throw new System.NotImplementedException();
        }*/
    }
}