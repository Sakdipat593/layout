using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace backend.EF;

[Table("TB_Category")]
public partial class TB_Category
{
    [Key]
    public int nCategoryID { get; set; }

    [StringLength(255)]
    [Unicode(false)]
    public string? sName { get; set; }
}
