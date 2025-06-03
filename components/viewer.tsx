'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';

interface ViewerProps {
  document: string;
}

interface ToolbarItem {
  type: 'custom';
  id: string;
  title: string;
  icon: string;
  onPress: (event: Event) => Promise<void>;
}

interface BoundingBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Anchor {
  x: number;
  y: number;
}

// Use TextBlock interface that matches PSPDFKit's content editing API
interface TextBlock {
  id: string;
  text: string;
  boundingBox: BoundingBox;
  anchor: Anchor;
  maxWidth: number;
}

interface UpdatedTextBlock {
  id: string;
  text?: string;
  anchor?: { x?: number; y?: number };
  maxWidth?: number;
}

interface DefaultToolbarItem {
  type: string;
}

interface MinimalToolbarItem {
  type: string;
}

export default function Viewer({ document }: ViewerProps) {
  const containerRef = useRef(null);
  const overlaysRef = useRef<string[]>([]);
  const textBlocksRef = useRef<(TextBlock & { pageIndex: number })[]>([]); // Store all text blocks for all pages
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selected, setSelected] = useState<(TextBlock & { pageIndex: number })[]>([]); // Changed to store complete TextBlock objects with page info
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const minimalToolbarItems: MinimalToolbarItem[] = [
    { type: 'sidebar-thumbnails' },
    { type: 'sidebar-thumbnails' },
    { type: 'sidebar-bookmarks' },
    { type: 'zoom-out' },
    { type: 'zoom-in' },
    { type: 'zoom-mode' },
    { type: 'search' },
  ];

  const handleContentBoxesPress = useCallback(
    async (event: Event) => {
      console.log('Content Boxes button pressed. Current isEditing state:', isEditing);

      if (isProcessing) {
        console.log('Already processing, ignoring click');
        return;
      }

      setIsProcessing(true);

      try {
        if (isEditing) {
          // If already editing, clear overlays and exit editing mode
          console.log('Removing overlays and exiting editing mode');
          overlaysRef.current.forEach((overlayId) => {
            window.viewerInstance.removeCustomOverlayItem(overlayId);
          });

          overlaysRef.current = [];
          textBlocksRef.current = [];
          setSelected([]);
          setIsEditing(false);
        } else {
          console.log('Starting editing mode');
          setIsEditing(true);

          // Create a fresh session just to get text blocks, then discard it
          const tempSession = await window.viewerInstance.beginContentEditingSession();

          try {
            // loop through all pages in the document
            const totalPages = window.viewerInstance.totalPageCount;
            let allTextBlocks: (TextBlock & { pageIndex: number })[] = [];

            for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
              const pageTextBlocks = await tempSession.getTextBlocks(pageIndex);
              const textBlocksWithPageIndex = pageTextBlocks.map((tb: TextBlock) => ({ ...tb, pageIndex }));
              allTextBlocks = allTextBlocks.concat(textBlocksWithPageIndex);
            }

            textBlocksRef.current = allTextBlocks; // Store text blocks for later reference

            const newOverlays: string[] = [];

            allTextBlocks.forEach((textBlock: TextBlock & { pageIndex: number }) => {
              const overlayDiv = window.document.createElement('div');
              overlayDiv.style.position = 'absolute';
              overlayDiv.style.border = '2px solid blue'; // initial border color
              overlayDiv.style.backgroundColor = 'transparent'; // transparent background
              overlayDiv.style.width = `${textBlock.boundingBox.width}px`;
              overlayDiv.style.height = `${textBlock.boundingBox.height}px`;
              overlayDiv.style.cursor = 'pointer';

              overlayDiv.addEventListener('click', () => {
                // Toggle the border color.
                const isCurrentlyBlue = overlayDiv.style.borderColor === 'blue' || overlayDiv.style.borderColor === '';
                overlayDiv.style.borderColor = isCurrentlyBlue ? 'red' : 'blue';

                setSelected((prevSelected) => {
                  if (isCurrentlyBlue) {
                    // If changing to red, add the textBlock if it's not already present
                    const isAlreadySelected = prevSelected.some((tb) => tb.id === textBlock.id);
                    return isAlreadySelected ? prevSelected : [...prevSelected, textBlock];
                  } else {
                    // If changing to blue, remove the textBlock from the array
                    return prevSelected.filter((tb) => tb.id !== textBlock.id);
                  }
                });
              });

              const overlayId = `overlay-${textBlock.id}`;
              const item = new window.PSPDFKit.CustomOverlayItem({
                id: overlayId,
                node: overlayDiv,
                pageIndex: textBlock.pageIndex,
                position: new window.PSPDFKit.Geometry.Point({
                  x: textBlock.boundingBox.left,
                  y: textBlock.boundingBox.top,
                }),
              });

              newOverlays.push(overlayId);
              window.viewerInstance.setCustomOverlayItem(item);
            });

            overlaysRef.current = newOverlays;
          } finally {
            // discard the temporary session;
            await tempSession.discard();
          }
        }
      } catch (error) {
        console.error('Error in content editing:', error);
        setIsEditing(false);
      } finally {
        setIsProcessing(false);
      }
    },
    [isEditing, isProcessing, currentPageIndex],
  );

  const contentBoxesToolbar: ToolbarItem = useMemo(
    () => ({
      type: 'custom',
      id: 'content-boxes',
      title: 'Content Boxes',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><rect x="5" y="5" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2"/><rect x="9" y="9" width="12" height="12" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
      onPress: handleContentBoxesPress,
    }),
    [handleContentBoxesPress],
  );

  const aiToolbar: ToolbarItem = useMemo(
    () => ({
      type: 'custom',
      id: 'ai',
      title: 'AI Replace',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><text x="4" y="17" font-family="sans-serif" font-size="14" font-weight="bold" fill="currentColor">AI</text></svg>',
      onPress: async (event: Event): Promise<void> => {
        if (!isEditing || selected.length === 0) {
          console.warn('AI Replace can only be used in editing mode with selected text blocks');
          return;
        }

        if (isProcessing) {
          console.log('Already processing, ignoring AI request');
          return;
        }

        setIsProcessing(true);

        try {
          console.log('AI Replace triggered with selected text blocks:', selected);

          // Create a session for AI text replacement operations
          const session = await window.viewerInstance.beginContentEditingSession();

          try {
            // Generate random replacement text for demonstration
            const generateRandomText = (originalText: string): string => {
              const originalLength = originalText.length;
              const words = [
                'AI',
                'tech',
                'smart',
                'fast',
                'new',
                'good',
                'best',
                'top',
                'big',
                'real',
                'data',
                'code',
                'web',
                'app',
                'tool',
                'work',
                'easy',
                'cool',
                'hot',
                'fun',
                'modern',
                'clean',
                'simple',
                'quick',
                'strong',
                'bright',
                'fresh',
                'bold',
              ];

              // Start with shorter words to have more room
              let result = '';
              let attempts = 0;
              const maxAttempts = 100;

              while (result.length < originalLength - 10 && attempts < maxAttempts) {
                const randomWord = words[Math.floor(Math.random() * words.length)];
                const testResult = result + (result ? ' ' : '') + randomWord;

                if (testResult.length <= originalLength) {
                  result = testResult;
                } else {
                  break;
                }
                attempts++;
              }

              // If we still have room and the result is too short, pad with lorem ipsum
              if (result.length < originalLength - 20) {
                const lorem = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua';
                const remainingLength = originalLength - result.length - 1; // -1 for space
                if (remainingLength > 0) {
                  const paddingText = lorem.substring(0, remainingLength);
                  result = result + (result ? ' ' : '') + paddingText;
                }
              }

              // Ensure we don't exceed the original length
              if (result.length > originalLength) {
                result = result.substring(0, originalLength).trim();
              }

              return result || 'AI text'; // Fallback if result is empty
            };

            // Create updated text blocks for the selected items
            const updatedTextBlocks: UpdatedTextBlock[] = selected.map((textBlock) => {
              const newText = generateRandomText(textBlock.text);
              console.log(`Text replacement for block ${textBlock.id}:`);
              console.log(`  Original: "${textBlock.text}" (length: ${textBlock.text.length})`);
              console.log(`  New: "${newText}" (length: ${newText.length})`);
              console.log(`  Length check: ${newText.length <= textBlock.text.length ? 'PASS' : 'FAIL'}`);

              return {
                id: textBlock.id,
                text: newText,
              };
            });

            console.log('Updating text blocks:', updatedTextBlocks);

            // Apply the text updates
            await session.updateTextBlocks(updatedTextBlocks);

            // Commit the changes to make them persistent
            await session.commit();

            console.log('AI text replacement completed and committed');

            // Clear editing state since document will reload after commit
            overlaysRef.current.forEach((overlayId) => {
              window.viewerInstance.removeCustomOverlayItem(overlayId);
            });
            overlaysRef.current = [];
            textBlocksRef.current = [];
            setSelected([]);
            setIsEditing(false);
          } catch (updateError) {
            console.error('Error during AI text update:', updateError);
            // Discard session on error
            await session.discard();
            throw updateError;
          }
        } catch (error) {
          console.error('Error in AI Replace operation:', error);
        } finally {
          setIsProcessing(false);
        }
      },
    }),
    [isEditing, selected, isProcessing],
  );

  useEffect(() => {
    const container = containerRef.current;

    const { NutrientViewer } = window;
    if (container && NutrientViewer) {
      const licenseKey = process.env.NEXT_PUBLIC_NUTRIENT_LICENSE_KEY || '';
      console.log('License key from env:', licenseKey ? 'Found (length: ' + licenseKey.length + ')' : 'Not found');

      console.log(window.NutrientViewer?.defaultToolbarItems);

      NutrientViewer.load({
        container,
        document,
        toolbarItems: [...minimalToolbarItems, contentBoxesToolbar, aiToolbar, { type: 'export-pdf' }],
        licenseKey: licenseKey,
      })
        .then((instance: NutrientViewerInstance) => {
          window.viewerInstance = instance;
          console.log('Nutrient Viewer loaded successfully');

          instance.addEventListener('viewState.currentPageIndex.change', (pageIndex: number) => {
            // currentPageIndex is zero-based
            console.log('Current page index:', pageIndex);
            setCurrentPageIndex(pageIndex);
          });
        })
        .catch((error: Error) => {
          console.error('Error loading Nutrient Viewer:', error);
        });
    }

    return () => {
      // Clean up overlays before unloading
      if (window.viewerInstance) {
        overlaysRef.current.forEach((overlayId) => {
          window.viewerInstance.removeCustomOverlayItem(overlayId);
        });
      }
      overlaysRef.current = [];
      textBlocksRef.current = [];
      // No need to clean up editSession since we use temporary sessions
      NutrientViewer?.unload(container);
    };
  }, [document]); // Only depend on document changes

  // Separate effect to update toolbar items
  useEffect(() => {
    if (window.viewerInstance) {
      window.viewerInstance.setToolbarItems([...minimalToolbarItems, contentBoxesToolbar, aiToolbar, { type: 'export-pdf' }]);
    }
  }, [contentBoxesToolbar, aiToolbar]);

  // Log selected text blocks for debugging
  useEffect(() => {
    console.log(
      'Selected text blocks:',
      selected.map((tb) => ({ id: tb.id, text: tb.text.substring(0, 50) + '...' })),
    );
  }, [selected]);

  // You must set the container height and width
  return <div ref={containerRef} style={{ height: '100vh', width: '100%' }} />;
}
