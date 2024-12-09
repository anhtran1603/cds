using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using static System.Net.Mime.MediaTypeNames;

namespace cds_be.Models
{
        public class AppDbContext : DbContext
        {
            public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
            public DbSet<Application> Applications { get; set; }
            public DbSet<Users> Users { get; set; }
            public DbSet<Company> Companies { get; set; }
            public DbSet<Employee> Employees { get; set; }
            public DbSet<License> Licenses { get; set; }
            public DbSet<Approval> Approvals { get; set; }
    }   
}
