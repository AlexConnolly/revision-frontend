import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useCallback,
  useEffect,
} from 'react';

// Types for the dialog provider
export type DialogSubmitOptions<T> = {
  text: string;
  onValidate: () => Promise<void>;
  onGetResult: () => T | Promise<T>;
};

export type DialogOptions<T> = {
  title: string;
  component: ReactNode;
  submit?: DialogSubmitOptions<T>;
  width?: string;
  icon?: ReactNode; // Optional icon for the dialog header
};

export type DialogContextType = {
  showDialogWithResult: <T>(options: DialogOptions<T>) => Promise<T>;
  showDialog: (options: DialogOptions<any>) => void;
  closeDialog: () => void;
  resolveDialog: (value: any) => void;
  rejectDialog: (err?: any) => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialogs, setDialogs] = useState<Array<{
    id: number;
    options: DialogOptions<any>;
    show: boolean;
    loading: boolean;
    error: string | null;
    resolver: { resolve: (val: any) => void; reject: (err?: any) => void };
    closeTimeoutRef: ReturnType<typeof setTimeout> | null;
    dialogContentRef: React.RefObject<HTMLDivElement | null>;
    errorTimeoutRef?: ReturnType<typeof setTimeout> | null; // for error auto-dismiss
  }>>([]);
  const dialogIdRef = useRef(0);

  const closeDialog = useCallback((id?: number) => {
    setDialogs(prev => {
      if (prev.length === 0) return prev;
      const idx = id !== undefined ? prev.findIndex(d => d.id === id) : prev.length - 1;
      if (idx === -1) return prev;
      const dialog = prev[idx];
      if (dialog.closeTimeoutRef) clearTimeout(dialog.closeTimeoutRef);
      // Reject the dialog promise if it exists
      if (dialog.resolver && typeof dialog.resolver.reject === 'function') {
        dialog.resolver.reject(new Error('Dialog closed'));
      }
      const newTimeout = setTimeout(() => {
        setDialogs(stack => stack.filter(d => d.id !== dialog.id));
      }, 200);
      return prev.map((d, i) =>
        i === idx ? { ...d, show: false, closeTimeoutRef: newTimeout } : d
      );
    });
  }, []);

  const resolveDialog = useCallback((value: any, id?: number) => {
    setDialogs(prev => {
      if (prev.length === 0) return prev;
      const idx = id !== undefined ? prev.findIndex(d => d.id === id) : prev.length - 1;
      if (idx === -1) return prev;
      const dialog = prev[idx];
      if (dialog.closeTimeoutRef) clearTimeout(dialog.closeTimeoutRef);
      dialog.resolver.resolve(value);
      const newTimeout = setTimeout(() => {
        setDialogs(stack => stack.filter(d => d.id !== dialog.id));
      }, 200);
      return prev.map((d, i) =>
        i === idx ? { ...d, show: false, closeTimeoutRef: newTimeout } : d
      );
    });
  }, []);

  const rejectDialog = useCallback((err?: any, id?: number) => {
    setDialogs(prev => {
      if (prev.length === 0) return prev;
      const idx = id !== undefined ? prev.findIndex(d => d.id === id) : prev.length - 1;
      if (idx === -1) return prev;
      const dialog = prev[idx];
      if (dialog.closeTimeoutRef) clearTimeout(dialog.closeTimeoutRef);
      dialog.resolver.reject(err);
      const newTimeout = setTimeout(() => {
        setDialogs(stack => stack.filter(d => d.id !== dialog.id));
      }, 200);
      return prev.map((d, i) =>
        i === idx ? { ...d, show: false, closeTimeoutRef: newTimeout } : d
      );
    });
  }, []);

  // Keep the original openDialog as a private function
  const openDialog = useCallback(<T,>(options: DialogOptions<T>): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const id = dialogIdRef.current++;
      setDialogs(prev => [
        ...prev,
        {
          id,
          options,
          show: false,
          loading: false,
          error: null,
          resolver: { resolve, reject },
          closeTimeoutRef: null,
          dialogContentRef: React.createRef<HTMLDivElement>(),
          errorTimeoutRef: null,
        },
      ]);
      setTimeout(() => {
        setDialogs(prev => {
          if (prev.length === 0) return prev;
          const idx = prev.findIndex(d => d.id === id);
          if (idx === -1) return prev;
          const dialog = prev[idx];
          return [
            ...prev.slice(0, idx),
            { ...dialog, show: true },
            ...prev.slice(idx + 1),
          ];
        });
      }, 10);
    });
  }, []);

  // Expose only these two methods
  const showDialogWithResult = useCallback(<T,>(options: DialogOptions<T>): Promise<T> => {
    return openDialog(options);
  }, [openDialog]);

  const showDialog = useCallback((options: DialogOptions<any>) => {
    openDialog(options).catch(() => {});
  }, [openDialog]);

  const handleSubmit = async () => {
    setDialogs(prev => {
      if (prev.length === 0) return prev;
      const top = prev[prev.length - 1];
      if (!top.options.submit) return prev;
      // Clear any previous error timeout
      if (top.errorTimeoutRef) clearTimeout(top.errorTimeoutRef);
      return [
        ...prev.slice(0, -1),
        { ...top, loading: true, error: null, errorTimeoutRef: null },
      ];
    });
    let result;
    try {
      const top = dialogs[dialogs.length - 1];
      if (!top.options.submit) return;
      await top.options.submit.onValidate();
      result = await top.options.submit.onGetResult();
      resolveDialog(result);
    } catch (err: any) {
      // Set error and start timer to clear it after 3 seconds
      setDialogs(prev => {
        if (prev.length === 0) return prev;
        const top = prev[prev.length - 1];
        // Clear any previous error timeout
        if (top.errorTimeoutRef) clearTimeout(top.errorTimeoutRef);
        const errorMsg = err?.message || 'Validation failed.';
        // Set up a timer to clear the error after 3 seconds
        const errorTimeoutRef = setTimeout(() => {
          setDialogs(current => {
            if (current.length === 0) return current;
            const currentTop = current[current.length - 1];
            // Only clear if the error is still the same
            if (currentTop.error === errorMsg) {
              return [
                ...current.slice(0, -1),
                { ...currentTop, error: null, errorTimeoutRef: null },
              ];
            }
            return current;
          });
        }, 3000);
        return [
          ...prev.slice(0, -1),
          { ...top, loading: false, error: errorMsg, errorTimeoutRef },
        ];
      });
    }
  };

  useEffect(() => {
    // Only auto-focus on non-mobile devices
    // Disable this for now as it's causing issues with the restock screen
    var enabled = false;

    if (!enabled) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (dialogs.length === 0) return;
    const top = dialogs[dialogs.length - 1];
    if (!isMobile && top.show && top.dialogContentRef.current) {
      const el = top.dialogContentRef.current.querySelector(
        'input:not([type=hidden]):not([disabled]), textarea:not([disabled]), select:not([disabled])'
      ) as HTMLElement | null;
      if (el) el.focus();
    }
  }, [dialogs]);

  const isOpen = dialogs.length > 0;

  return (
    <DialogContext.Provider value={{
      showDialogWithResult,
      showDialog,
      closeDialog,
      resolveDialog,
      rejectDialog,
    }}>
      {children}
      {dialogs.map((dialog, idx) => (
        <div
          key={dialog.id}
          className="fixed inset-0 z-modal flex items-center justify-center"
          aria-modal="true"
          role="dialog"
          style={{ pointerEvents: idx === dialogs.length - 1 ? 'auto' : 'none' }}
        >
          {/* Backdrop */}
          <div
            className={`absolute inset-0 transition-opacity duration-200 ${
              dialog.show ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundColor: 'rgba(44, 44, 44, 0.5)' }}
            onClick={() => closeDialog()}
            aria-label="Close dialog"
          />
          {/* Dialog */}
          <div
            className={`relative rounded-card p-6 w-full mx-4 sm:mx-0 z-50 shadow-elevated max-h-[90vh] overflow-hidden transition-all duration-200 ${
              dialog.show
                ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 translate-y-4'
            } ${dialog.options?.width || 'max-w-sm'} bg-warm-white`}
            style={{ maxWidth: dialog.options?.width || '24rem' }}
            onClick={e => e.stopPropagation()}
            ref={dialog.dialogContentRef}
          >
            <button
              onClick={() => closeDialog()}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-pill bg-light-gray hover:opacity-80 text-text-secondary transition-gentle"
              aria-label="Close dialog"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6 6 18"></path><path d="M6 6 18 18"></path></svg>
            </button>
            <div className="flex items-center text-h2 font-bold mb-4 pr-10 break-words text-text-primary">
              {dialog.options.icon && <div className="mr-3">{dialog.options.icon}</div>}
              {dialog.options.title}
            </div>
            <div className="flex flex-col h-full max-h-[70vh]">
              <div className="flex-1 overflow-y-auto text-text-secondary break-words relative">
                {dialog.options.component}
                {dialog.loading && (
                  <div className="absolute inset-0 bg-warm-white bg-opacity-70 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center">
                      <span className="loader mb-2" />
                      <span className="text-text-primary font-semibold">Loading...</span>
                    </div>
                  </div>
                )}
              </div>
              {dialog.options.submit && (
                <div className="flex space-x-2 mt-6 relative pt-4 bg-warm-white sticky bottom-0 z-10">
                  <button
                    onClick={handleSubmit}
                    className="flex-grow px-6 py-4 rounded-card bg-muted-blue hover:opacity-90 text-warm-white text-body-sm font-medium flex items-center justify-center disabled:opacity-50 transition-gentle"
                    disabled={dialog.loading}
                  >
                    {dialog.loading && <span className="loader mr-2" />}
                    {dialog.options.submit.text}
                  </button>
                  {dialog.error && (
                    <div className="absolute left-0 right-0 -top-12 bg-muted-red bg-opacity-10 text-muted-red rounded-card px-4 py-3 text-center font-semibold shadow-soft border border-muted-red border-opacity-20">
                      {dialog.error}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('useDialog must be used within a DialogProvider');
  return context;
};

export function showDialogWithResult<T>(options: DialogOptions<T>): Promise<T> {
  const { showDialogWithResult } = require('./DialogProvider').useDialog();
  return showDialogWithResult(options);
}

export function showDialog(options: DialogOptions<any>): void {
  const { showDialog } = require('./DialogProvider').useDialog();
  showDialog(options);
}
