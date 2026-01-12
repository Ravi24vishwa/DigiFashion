import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { setTabBarVisible } from '../store/slices/uiSlice';

export const useAppUI = () => {
    const dispatch = useDispatch();
    const isTabBarVisible = useSelector((state) => state.ui.isTabBarVisible, shallowEqual);

    const handleSetTabBarVisible = useCallback((visible) => {
        dispatch(setTabBarVisible(visible));
    }, [dispatch]);

    return useMemo(() => ({
        isTabBarVisible,
        setTabBarVisible: handleSetTabBarVisible,
        setIsTabBarVisible: handleSetTabBarVisible, // Alias for compatibility
    }), [isTabBarVisible, handleSetTabBarVisible]);
};
