using System.ComponentModel.DataAnnotations;

namespace ApiAuth.Models
{
    public class User
    {
        [Key]
        public int usr_id { get; set; }
        [Required]
        public string? usr_user_name { get; set; }
        [Required]
        public string? usr_email { get; set; }
        [Required]
        public string? usr_password { get; set; }
    }
}
