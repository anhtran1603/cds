using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace cds_be.Models
{
    public class Application
    {
        [Key]
        public string ApplicationID { get; set; } // Primary key

        [Required]
        public int CompanyID { get; set; }

        [Required]
        public string SubmitterName { get; set; }

        [Required]
        public DateTime SubmitDate { get; set; }

        [Required]
        public string Status { get; set; }

        public string TaxCode { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [Phone]
        public string PhoneNumber { get; set; }

        [Required]
        public string ApplicationType { get; set; }

        public string ApplicationFile { get; set; }

        public string CertificationDocument { get; set; }
      
        public string ApplicationFileContent { get; set; }
        public string CertificationDocumentContent { get; set; }
        public int? Appraiser { get; set; }
        public string? AppraiserName { get; set; }
        public string? ReasonRejection { get; set; }
        public DateTime? ReturnDate { get; set; }
        public int? Duration { get; set; }
    }
}
