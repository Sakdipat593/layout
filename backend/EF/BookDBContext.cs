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
        modelBuilder.Entity<TB_Auther>(entity =>
        {
            entity.HasKey(e => e.nAutherID).HasName("nAutherID");

            entity.Property(e => e.nAutherID).ValueGeneratedNever();
        });

        modelBuilder.Entity<TB_Book>(entity =>
        {
            entity.HasKey(e => e.nBookID).HasName("nBookID");

            entity.Property(e => e.nBookID).ValueGeneratedNever();
        });

        modelBuilder.Entity<TB_Category>(entity =>
        {
            entity.HasKey(e => e.nCategoryID).HasName("nCategoryID");

            entity.Property(e => e.nCategoryID).ValueGeneratedNever();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
