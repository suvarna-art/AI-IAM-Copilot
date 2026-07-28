const data = [
  {
    user: "John Smith",
    action: "Role Updated",
    status: "Completed",
  },
  {
    user: "Emily Clark",
    action: "Access Request",
    status: "Pending",
  },
  {
    user: "David Lee",
    action: "Account Disabled",
    status: "Completed",
  },
];

export default function ActivityTable() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

      <h2 className="text-xl font-semibold text-white mb-6">
        Recent Activity
      </h2>

      <table className="w-full">

        <thead className="text-slate-400">

          <tr className="border-b border-slate-800">

            <th className="text-left pb-3">User</th>

            <th className="text-left pb-3">Action</th>

            <th className="text-left pb-3">Status</th>

          </tr>

        </thead>

        <tbody>

          {data.map((item) => (
            <tr
              key={item.user}
              className="border-b border-slate-800"
            >
              <td className="py-4 text-white">
                {item.user}
              </td>

              <td className="text-slate-300">
                {item.action}
              </td>

              <td className="text-green-400">
                {item.status}
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}