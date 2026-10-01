import LogsViewer from '@/components/admin/logs';
// import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';


export default async function LogsPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // const session = await getServerSession();
    if (!accessToken) {
        return <div>Unauthorized</div>;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">System Logs</h1>
            <LogsViewer token={accessToken} />
        </div>
    );
}