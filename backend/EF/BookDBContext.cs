using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.EF;

public partial class BookDBContext : DbContext
{
    public BookDBContext()
    {
    }

    public BookDBContext(DbContextOptions<BookDBContext> options)
        : base(options)
    {
    }

    public virtual DbSet<TB_Auther> TB_Authers { get; set; }

    public virtual DbSet<TB_Book> TB_Books { get; set; }

    public virtual DbSet<TB_Category> TB_Categories { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
