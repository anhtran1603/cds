using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cds_be.Models
{
    public class Users
    {
        [Key]
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public int RoleID { get; set; } // Add role for authorization
        public string FullName { get; set; }

        [ForeignKey("RoleID")]
        public Role? Role { get; set; }


    }

    public class UserLogin
    {
        public string UserName { get; set; }
        public string Password { get; set; }

    }
}
