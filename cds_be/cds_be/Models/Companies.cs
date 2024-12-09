using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cds_be.Models
{
    public class Company
    {
            [Key]
            [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
            public int CompanyID { get; set; } // Primary key

            [Required]
            public string CompanyName { get; set; }

            [Required]
            public string TaxCode { get; set; }

            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            [Phone]
            public string PhoneNumber { get; set; }
      
    }
}
