namespace DatabaseLayer.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _001 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.DbAccounts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Balance = c.Decimal(nullable: false, precision: 18, scale: 2),
                        UserId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.DbUsers", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.DbUsers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(maxLength: 4000),
                        Password = c.String(maxLength: 4000),
                        Email = c.String(maxLength: 4000),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.DbTransactions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Amount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        RecipientId = c.Int(nullable: false),
                        PayeeId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.DbAccounts", t => t.PayeeId, cascadeDelete: false)
                .ForeignKey("dbo.DbAccounts", t => t.RecipientId, cascadeDelete: false)
                .Index(t => t.RecipientId)
                .Index(t => t.PayeeId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.DbTransactions", "RecipientId", "dbo.DbAccounts");
            DropForeignKey("dbo.DbTransactions", "PayeeId", "dbo.DbAccounts");
            DropForeignKey("dbo.DbAccounts", "UserId", "dbo.DbUsers");
            DropIndex("dbo.DbTransactions", new[] { "PayeeId" });
            DropIndex("dbo.DbTransactions", new[] { "RecipientId" });
            DropIndex("dbo.DbAccounts", new[] { "UserId" });
            DropTable("dbo.DbTransactions");
            DropTable("dbo.DbUsers");
            DropTable("dbo.DbAccounts");
        }
    }
}
