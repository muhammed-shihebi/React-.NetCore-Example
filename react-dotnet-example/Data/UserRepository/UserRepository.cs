using System.Collections.Generic;

namespace react_dotnet_example.Models
{
    public class UserRepository : IUserRepository
    {

        private User user = new User { email = "email1@gmail.com", password = "1234" };

        public User Add(User user)
        {
            throw new System.NotImplementedException();
        }

        public User Delete(string email)
        {
            throw new System.NotImplementedException();
        }

        public IEnumerable<User> GetAllUsers()
        {
            throw new System.NotImplementedException();
        }

        public User GetUser()
        {
            return user;
        }

        public User GetUser(string email)
        {
            throw new System.NotImplementedException();
        }

        public User Update(User userChanges)
        {
            throw new System.NotImplementedException();
        }
    }
}