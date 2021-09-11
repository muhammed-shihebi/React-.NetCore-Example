
using Microsoft.EntityFrameworkCore.Migrations;

namespace react_dotnet_example.Migrations
{
    public partial class addOrgaETSOtoOrdersclass : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ETSO",
                table: "Orders",
                newName: "SantralETSO");

            migrationBuilder.AddColumn<string>(
                name: "OrgaETSO",
                table: "Orders",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrgaETSO",
                table: "Orders");

            migrationBuilder.RenameColumn(
                name: "SantralETSO",
                table: "Orders",
                newName: "ETSO");
        }
    }
}
