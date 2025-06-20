import Layout from '../components/Layout';

export default function Dashboard() {
  return (
    <Layout>
      <div className='p-5 flex flex-col items-center justify-center'>
        <h1 className="text-2xl font-bold">Welcome to Excel Analytics Platform</h1>
        <p className="text-gray-600 mt-2"> You're now logged in 🎉 Use the sidebar to upload Excel files, view history, or access admin tools.
        </p>
      </div>
    </Layout>
  );
}
