using DatabaseLayer.Entities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseLayer
{
    public class PWContext : DbContext
    {
        public DbSet<DbUser> DbUsers { get; set; }
        public DbSet<DbAccount> DbAccounts { get; set; }
        public DbSet<DbTransaction> DbTransactions { get; set; }

        public PWContext() { }

        public PWContext(string connectionString) : base(connectionString)
        {
            Configuration.LazyLoadingEnabled = true;
        }
    }

    public static class PWContextFactory 
    {
        public static PWContext GetContext(string connectionString)
        {
            var context = new PWContext(connectionString);
            return context;
        }
    }
}