// // import { LocationState } from 'history';
// import { useContext, useEffect } from 'react';
// // import { RouteComponentProps, StaticContext } from 'react-router';
// import useForceUpdate from 'use-force-update';

// // console.log('StaticContext:', StaticContext);
// // console.log('RouteComponentProps:', RouteComponentProps);
// export default function useRouter() {
//   const context = useContext();
//   const forceUpdate = useForceUpdate();
//   useEffect(
//     () =>
//       context.history.listen(forceUpdate),
//     [context]
//   );
//   return context;
// }
