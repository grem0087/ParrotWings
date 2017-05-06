using DatabaseLayer.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DatabaseLayer.Repository
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly PWContext _context;

        public RepositoryManager(PWContext context)
        {
            _context = context;
        }

        public void SaveChanges()
        {
            _context.SaveChanges();
        }

        ICommonRepository<TDbEntity> IRepositoryManager.GetCommonRepository<TDbEntity>()
        {
            return new CommonRepository<TDbEntity>(_context);
        }
    }
}
