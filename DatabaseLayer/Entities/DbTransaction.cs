using DatabaseLayer.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseLayer.Entities
{
    public class DbTransaction : IWithId
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        
        public int RecipientId { get; set; }
        [ForeignKey(nameof(RecipientId))]
        public virtual DbAccount Recipient { get; set; }

        public int PayeeId { get; set; }
        [ForeignKey(nameof(PayeeId))]
        public virtual DbAccount Payee { get; set; }
    }
}
