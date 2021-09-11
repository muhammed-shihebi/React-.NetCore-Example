using ConsoleApp.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp.DataContext
{
    class AppDbContext: DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("data source=DESKTOP-2TEVJBL\\MYSQLINSTANCE;initial catalog=master;trusted_connection=true;database=UsersDB"); 
        }
        public DbSet<Order> Orders { get; set; } 
        public DbSet<EntityType> EntityTypes{ get; set; } 
        public DbSet<CentralData> CentralDatas { get; set; }
        public DbSet<ExcelFile> ExcelFiles { get; set; }
    }
}
