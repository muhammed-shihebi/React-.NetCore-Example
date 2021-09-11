using Microsoft.EntityFrameworkCore;
using react_dotnet_example.Models.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace react_dotnet_example.Models
{
    public class AppDbContext: DbContext
    {
        // base(options) bassed thed options to the DbContext   
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<User> Users { get; set; }

        public DbSet<EntityType> EntityTypes{ get; set; }

        public DbSet<CentralData> CentralDatas{ get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Santral> Santrals { get; set; }
        public DbSet<Organization> Organizations { get; set;  }
        public DbSet<ExcelFile> ExcelFiles { get; set; }

    }
}
