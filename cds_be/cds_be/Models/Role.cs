using System.ComponentModel.DataAnnotations;

namespace cds_be.Models
{
    public class Role
    {
        [Key]
        public int RoleID { get; set; }
        public string RoleName { get; set; }
    }
}
