using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cds_be.Models
{
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int EmployeeID { get; set; } // Primary key

        [Required]
        public string ApplicationID { get; set; }

        [Required]
        public string FullName { get; set; }


        public string TrainingLevel { get; set; }


        public int ExperienceMonths { get; set; }


        public string LicenseType { get; set; }


        public string TestVehicleCode { get; set; }


        public string CitizenID { get; set; }

        [Required]
        public DateTime DateOfBirth { get; set; }

  
        public string PhoneNumber { get; set; }

        [Required]
        public int CompanyID { get; set; }
        public string Avatar { get; set; }
        public string? PersonalStatement { get; set; }
        public string? PersonalStatementContent { get; set; }
        public string? HealthCertificate { get; set; }
        public string? HealthCertificateContent { get; set; }
        public string? RailwayType { get; set; }
        public string? Status { get; set; }
    }
}