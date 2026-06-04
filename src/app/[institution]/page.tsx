import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ institution: string }>;
}

export default async function InstitutionIndexPage({ params }: Props) {
  const { institution } = await params;
  redirect(`/${institution}/home`);
}
