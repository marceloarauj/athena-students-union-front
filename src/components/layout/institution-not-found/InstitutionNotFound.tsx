import { Building2, AlertTriangle } from 'lucide-react';

interface InstitutionNotFoundProps {
  institution: string;
}

export default function InstitutionNotFound({ institution }: InstitutionNotFoundProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <Building2 className="w-24 h-24 text-muted-foreground opacity-30" />
            <div className="absolute -top-1 -right-1 bg-destructive rounded-full p-1">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Instituição não encontrada</h1>
          <p className="text-muted-foreground">
            A instituição{' '}
            <span className="font-mono font-semibold text-foreground bg-muted px-1.5 py-0.5 rounded text-sm">
              {institution}
            </span>{' '}
            não está cadastrada na plataforma Athena.
          </p>
        </div>

        <div className="border border-border rounded-lg p-4 bg-card text-left space-y-1">
          <p className="text-sm font-medium text-card-foreground">Possíveis causas:</p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>O endereço digitado contém um erro de digitação</li>
            <li>A instituição ainda não foi cadastrada</li>
            <li>O acesso à instituição foi desativado</li>
          </ul>
        </div>

        <p className="text-xs text-muted-foreground">
          Se você acredita que isso é um erro, entre em contato com o administrador da sua instituição.
        </p>
      </div>
    </div>
  );
}
