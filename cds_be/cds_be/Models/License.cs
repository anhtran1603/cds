using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cds_be.Models
{
    public class License
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int LicenseID { get; set; } // Primary key

        [Required]
        public int EmployeeID { get; set; }

        [Required]
        public string LicenseNumber { get; set; }

        [Required]
        public DateTime? IssueDate { get; set; }

        [Required]
        public DateTime? ExpiryDate { get; set; }

        [Required]
        public string? IssuingAuthority { get; set; }

        [Required]
        public string? SignedBy { get; set; }

        public string? Status { get; set; }
    }
}