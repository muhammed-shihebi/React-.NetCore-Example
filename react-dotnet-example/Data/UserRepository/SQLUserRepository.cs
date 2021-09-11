using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace react_dotnet_example.Models
{
    public class SQLUserRepository : IUserRepository
    {
        private AppDbContext context;

        public SQLUserRepository(AppDbContext context)
        {
            this.context = context; 
        }
        public User Add(User newUser)
        {
            context.Users.Add(newUser);
            context.SaveChanges();
            return newUser; 
        }

        public User Delete(string email)
        {
            User user = context.Users.Find(email);
            if(user != null)
            {
                context.Users.Remove(user);
                context.SaveChanges(); 
            }
            return user; // null if nothing happens 
        }

        public IEnumerable<User> GetAllUsers()
        {
            return context.Users; 
        }

        public User GetUser(string email)
        {
            Console.WriteLine("email: " +  email);
            return context.Users.Find(email); 
        }

        public User Update(User userChanges)
        {
            var user = context.Users.Attach(userChanges);
            user.State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            context.SaveChanges();
            return userChanges; 
        }
    }
}
