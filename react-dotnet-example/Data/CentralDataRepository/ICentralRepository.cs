using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using react_dotnet_example.Models.Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace react_dotnet_example.Models.CentralDataRepository
{
    public interface ICentralRepository
    {
        IEnumerable<CentralData> GetAllData([FromBody] JsonElement parameters);
        void AddData([FromBody] JsonElement data);
        void RemoveData(CentralData cd);
        void AddSmallData([FromBody] JsonElement data);
        void AddOrganisation([FromBody] JsonElement orga, [FromBody] JsonElement santrals);

        IEnumerable<Santral> GetOrgaSantral();

        void AddOrders(Order data);
        void AddExcelFile(JsonElement jfileInfo, IFormFile file);
        public List<Order> GetOrders();
        public List<ExcelFile>  GetExcelFiles(JsonElement data);
    }
}
