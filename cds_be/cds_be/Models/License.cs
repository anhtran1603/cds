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
        public DateTime IssueDate { get; set; }

        [Required]
        public DateTime ExpiryDate { get; set; }

        [Required]
        public string IssuingAuthority { get; set; }

        [Required]
        public string SignedBy { get; set; }

        public string PhotoPath { get; set; }

        [Required]
        public string CitizenID { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        public string Workplace { get; set; }

        [Required]
        public string Nationality { get; set; }

        [Required]
        public string OperatingRoute { get; set; }

        [Required]
        public string RailSpecialization { get; set; }
    }
}