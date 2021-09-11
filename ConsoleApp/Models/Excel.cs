using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp.Models
{
    // this class represent one excel row
    class Excel
    {
        public DateTime Tarih { get; set; } = new DateTime();
        public double Toplam
        {
            get
            {
                return Dogalgaz + Ruzgar + Linyit + TasKomur + IthalKomur + FuelOil + Jeotermal + Barajli + Nafta + Biokutle + Akarsu + Diger;
            }
            set
            {
                _toplam = value;
            }
        }

        private double _toplam;

        public double Dogalgaz { get; set; } = 0;
        public double Ruzgar { get; set; } = 0;
        public double Linyit { get; set; } = 0;
        public double TasKomur { get; set; } = 0;
        public double IthalKomur { get; set; } = 0;
        public double FuelOil { get; set; } = 0;
        public double Jeotermal { get; set; } = 0;
        public double Barajli { get; set; } = 0;
        public double Nafta { get; set; } = 0;
        public double Biokutle { get; set; } = 0;
        public double Akarsu { get; set; } = 0;
        public double Diger { get; set; } = 0;
        public string SantralETSO { get; set; } = "";
        public string OrgaETSO { get; set; } = "";
        public string DataType { get; set; } = "";
        public int OrderId { get; set; } = 0;
        public string DataSource { get; set; } = "";
    }
}
