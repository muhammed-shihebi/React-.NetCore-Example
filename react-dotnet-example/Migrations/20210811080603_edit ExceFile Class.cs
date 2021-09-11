using Microsoft.EntityFrameworkCore.Migrations;

namespace react_dotnet_example.Migrations
{
    public partial class editExceFileClass : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Error",
                table: "ExcelFiles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Message",
                table: "ExcelFiles",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "State",
                table: "ExcelFiles",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Error",
                table: "ExcelFiles");

            migrationBuilder.DropColumn(
                name: "Message",
                table: "ExcelFiles");

            migrationBuilder.DropColumn(
                name: "State",
                table: "ExcelFiles");
        }
    }
}
