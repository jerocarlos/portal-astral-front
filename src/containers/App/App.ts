import { connect } from 'react-redux';
import { IStore } from '../../reducers';
import { App } from '../../components';

const mapStateToProps = (state: IStore): any => {
  return {};
};

const mapDispatchToProps = (dispatch: (action: any) => any | void): any => ({});

export default (connect(mapStateToProps, mapDispatchToProps) as any)(App) as typeof App;