// Arquivo responsável pela limpeza dos padrões de sessão
import { cleanAllUserDataSubDirs } from '../../playwright.env';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown() {
   console.log('🧹 GLOBAL TEARDOWN INICIADO');
   console.log('Executando globalTeardown: Limpando diretórios de user data...');
   cleanAllUserDataSubDirs();

   // Se iniciamos um Xvfb no global-setup, tentamos encerrá-lo aqui
   try {
      const XVFB_PID_FILE = path.join(process.cwd(), 'test-artifacts', '.xvfb.pid');
      if (process.platform === 'linux' && fs.existsSync(XVFB_PID_FILE)) {
         const pidStr = fs.readFileSync(XVFB_PID_FILE, 'utf-8').trim();
         const pid = Number(pidStr);
         if (pid) {
            try {
               process.kill(pid, 'SIGTERM');
               console.log(`Xvfb finalizado (pid=${pid})`);
            } catch (err) {
               console.warn('Não foi possível finalizar Xvfb (talvez já esteja morto):', (err as any)?.message ?? err);
            }
         }
         try { fs.unlinkSync(XVFB_PID_FILE); } catch (e) { }
      }
   } catch (e) {
      console.warn('Erro ao tentar encerrar Xvfb na finalização:', (e as any)?.message ?? e);
   }
   console.log('🧹 GLOBAL TEARDOWN FINALIZADO');
}

export default globalTeardown;