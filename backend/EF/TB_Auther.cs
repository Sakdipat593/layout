using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.EF;

[Table("TB_Auther")]
public partial class TB_Auther
{
    [Key]
    public int nAutherID { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? sName { get; set; }
}
