using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.EF;

[Table("TB_Book")]
public partial class TB_Book
{
    [Key]
    public int nBookID { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? sName { get; set; }

    public int? nAmount { get; set; }

    public bool? isPrint { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? dRelease { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? dCreate { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? dUpdate { get; set; }

    public bool? isDelete { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? dDelete { get; set; }

    public int? nCategoryID { get; set; }

    public int? nAutherID { get; set; }
}
