using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace cds_be.Models
{
    public class Approval
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ApprovalID { get; set; } // Primary key

        [Required]
        public int ApplicationID { get; set; }

        [Required]
        public string ApprovedBy { get; set; }

        [Required]
        public DateTime ApprovalDate { get; set; }

        [Required]
        public string ApprovalType { get; set; }

        [Required]
        public string Decision { get; set; }

        public string RejectionReason { get; set; }

        public string Notes { get; set; }
    }
}