using System.Collections.Generic;

namespace react_dotnet_example.Models
{
    public interface IUserRepository
    {
        User GetUser(string email);
        IEnumerable<User> GetAllUsers();
        User Add(User user); 
        User Delete(string email);
        User Update(User userChanges); 
    }
}